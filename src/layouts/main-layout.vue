<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getDocs, collection, getFirestore, query, where, orderBy, addDoc, onSnapshot } from 'firebase/firestore';
import { useSessionStore } from 'stores/session';
import { mdiSend } from '@quasar/extras/mdi-v6';

const conversations = ref<User[]>([]);

const session = useSessionStore();

interface User {
    name: string,
    email: string,
    photoUrl: string,
    id: string,
}

interface MessagesResponse {
    name?: string;
    text?: string[];
    timestamp?: number
}

const items = ref<MessagesResponse[]>([]);
const loadingPagination = ref(false);
const messageLoading = ref(false);

function onLoad (done: () => void) {
    loadingPagination.value = true;
    setTimeout(() => {
        items.value!.splice(0, 0, {name: 'Carter', text: ['hey']}, {name: 'me', text: ['hey, how are you?']});
        loadingPagination.value = false;
        done();
    }, 2000);
}

const $q = useQuasar();

const leftDrawerOpen = ref(false);
const search = ref('');
const message = ref('');
const currentConversationIndex = ref(0);

const currentConversation = computed(() => {
    return conversations.value[currentConversationIndex.value];
});


const style = computed(() => ({
    height: `${$q.screen.height  }px`,
}));

function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

function setCurrentConversation (index: number) {
    currentConversationIndex.value = index;
}

onMounted(async () => {
    const result = await getDocs(query(collection(getFirestore(), 'users'), where('id', '!=', session.user?.uid)));

    conversations.value = result.docs.map(doc => doc.data() as User);

    const messagesRef = query(collection(getFirestore(), `users/${session.user?.uid}/conversations/${currentConversation.value.id}/messages`), orderBy('timestamp'));

    const messagesSnap = await getDocs(messagesRef);

    const messagesArray = messagesSnap.docs.map(doc => doc.data()) as MessagesResponse[];

    items.value = messagesArray;
    console.log(conversations.value);
});

watch((currentConversation), () => {
    if (!currentConversation.value.id) return;
    const messagesRef = query(collection(getFirestore(), `users/${session.user?.uid}/conversations/${currentConversation.value.id}/messages`), orderBy('timestamp'));

    const messagesSnap = onSnapshot(messagesRef, snapshot => {
        const messagesArray = snapshot.docs.map(doc => doc.data()) as MessagesResponse[];

        items.value = messagesArray;
    });
});






async function sendMessage (message2: string) {
    messageLoading.value = true;
    try {
        await addDoc(collection(getFirestore(), `users/${session.user?.uid}/conversations/${currentConversation.value.id}/messages`), {
            name: 'me',
            text: [message2],
            timestamp: Date.now(),
        });
        await addDoc(collection(getFirestore(), `users/${currentConversation.value.id}/conversations/${session.user?.uid}/messages`), {
            name: currentConversation.value.name,
            text: [message2],
            timestamp: Date.now(),
        });
    }
    catch (err) {
        console.log(err);
    }
    finally {
        messageLoading.value = false;
        message.value = '';
    }

}

</script>

<template>
    <div
        class="WAL position-relative bg-grey-4"
        :style="style"
    >
        <q-layout
            v-if="currentConversation"
            view="lHh Lpr lFf"
            class="WAL__layout shadow-3"
            container
        >
            <q-header elevated>
                <q-toolbar class="bg-grey-3 text-black">
                    <q-btn
                        round
                        flat
                        icon="keyboard_arrow_left"
                        class="WAL__drawer-open q-mr-sm"
                        @click="toggleLeftDrawer"
                    />

                    <q-btn
                        round
                        flat
                    >
                        <q-avatar>
                            <img :src="currentConversation.photoUrl">
                        </q-avatar>
                    </q-btn>

                    <span class="q-subtitle-1 q-pl-md">
                        {{ currentConversation.name }}
                    </span>

                    <q-space />

                    <q-btn
                        round
                        flat
                        icon="search"
                    />
                    <q-btn
                        round
                        flat
                    >
                        <q-icon
                            name="attachment"
                            class="rotate-135"
                        />
                    </q-btn>
                    <q-btn
                        round
                        flat
                        icon="more_vert"
                    >
                        <q-menu
                            auto-close
                            :offset="[110, 0]"
                        >
                            <q-list style="min-width: 150px">
                                <q-item clickable>
                                    <q-item-section>Contact data</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Block</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Select messages</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Silence</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Clear messages</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Erase messages</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </q-toolbar>
            </q-header>

            <q-drawer
                v-model="leftDrawerOpen"
                show-if-above
                bordered
                :breakpoint="690"
            >
                <q-toolbar class="bg-grey-3">
                    <q-avatar class="cursor-pointer">
                        <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
                    </q-avatar>

                    <q-space />

                    <q-btn
                        round
                        flat
                        icon="message"
                    />
                    <q-btn
                        round
                        flat
                        icon="more_vert"
                    >
                        <q-menu
                            auto-close
                            :offset="[110, 8]"
                        >
                            <q-list style="min-width: 150px">
                                <q-item clickable>
                                    <q-item-section>New group</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Profile</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Archived</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Favorites</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Settings</q-item-section>
                                </q-item>
                                <q-item clickable>
                                    <q-item-section>Logout</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

                    <q-btn
                        round
                        flat
                        icon="close"
                        class="WAL__drawer-close"
                        @click="toggleLeftDrawer"
                    />
                </q-toolbar>

                <q-toolbar class="bg-grey-2">
                    <q-input
                        v-model="search"
                        rounded
                        outlined
                        dense
                        class="WAL__field full-width"
                        bg-color="white"
                        placeholder="Search or start a new conversation"
                    >
                        <template #prepend>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </q-toolbar>

                <q-scroll-area style="height: calc(100% - 100px)">
                    <q-list>
                        <q-item
                            v-for="(conversation, index) in conversations"
                            :key="conversation.id"
                            v-ripple
                            clickable
                            @click="setCurrentConversation(index)"
                        >
                            <q-item-section avatar>
                                <q-avatar>
                                    <img :src="conversation.photoUrl">
                                </q-avatar>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label lines="1">
                                    {{ conversation.name }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-scroll-area>
            </q-drawer>
            <q-page-container>
                <q-page class="bg-grey-5">
                    <q-infinite-scroll
                        scroll-target="wrapper"
                        reverse
                        class="full-height"
                    >
                        <div
                            class="full-width row align-center justify-center"
                        >
                            <q-btn
                                class="q-ma-md"
                                no-caps
                                color="accent"
                                :loading="loadingPagination"
                                @click="onLoad(()=>{})"
                            >
                                Carregar Mais
                                <template #loading>
                                    <q-spinner
                                        color="white"
                                        size="1rem"
                                    />
                                </template>
                            </q-btn>
                        </div>
                        <q-chat-message
                            v-for="(item, index) in items"
                            :key="index"
                            :name="item.name"
                            :text="item.text"
                            :sent="item.name === 'me'"
                            :bg-color="item.name === 'me' ? 'white' : 'accent'"
                            :text-color="item.name === 'me' ? 'black' : 'white'"
                        />
                        <q-chat-message
                            v-if="messageLoading"
                            :name="currentConversation.name"
                            bg-color="accent"
                        >
                            <q-spinner-dots size="2rem" />
                        </q-chat-message>
                    </q-infinite-scroll>
                </q-page>
            </q-page-container>


            <q-footer>
                <q-toolbar class="bg-grey-3 text-black row">
                    <q-btn
                        round
                        flat
                        icon="insert_emoticon"
                        class="q-mr-sm"
                    />
                    <q-input
                        v-model="message"
                        rounded
                        outlined
                        dense
                        class="WAL__field col-grow q-mr-sm"
                        bg-color="white"
                        placeholder="Type a message"
                    />
                    <q-btn
                        round
                        flat
                        :icon="mdiSend"
                        @click="sendMessage(message)"
                    />
                </q-toolbar>
            </q-footer>
        </q-layout>
    </div>
</template>

<style lang="scss">
  .WAL {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;

  &:before {
    content: '';
    height: 127px;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: $accent;
  }

  &__layout {
    margin: 0 auto;
    z-index: 4000;
    height: 100%;
    width: 90%;
    max-width: 950px;
    border-radius: 5px;
  }

  &__field.q-field--outlined .q-field__control:before {
    border: none;
  }

  .q-drawer--standard {
    .WAL__drawer-close {
      display: none;
    }
  }
}

@media (max-width: 850px) {
  .WAL {
    padding: 0;

    &__layout {
      width: 100%;
      border-radius: 0;
    }
  }
}

@media (min-width: 691px) {
  .WAL {
    &__drawer-open {
      display: none;
    }
  }
}

.conversation__summary {
  margin-top: 4px;
}

.conversation__more {
  margin-top: 0!important;
  font-size: 1.4rem;
}
.wrapper{
    margin-bottom: 5rem;
    overflow: scroll;
    max-height: 100%;
    padding-top: 5rem;
}

</style>
