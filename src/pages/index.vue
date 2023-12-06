<script setup lang="ts">
import { ref } from 'vue';

import { useSessionStore } from 'stores/session';
import useError  from 'src/hooks/useError';

const session = useSessionStore();

const error = useError();

const loading = ref(false);



async function login() {
    loading.value = true;
    try {
        await session.login();
    }
    catch (err) {
        error(err);
    }
    finally {
        loading.value = false;
    }
}
</script>

<template>
    <q-page class="page column full-height align-center q-pa-lg bg-accent items-center">
        <q-card
            vertical
            class="card-wrapper"
        >
            <q-card-section class="column justify-center">
                <div class="text-center text-h3 text-weight-bold q-mt-xl">
                    <span class="text-accent">Inter</span> Connect
                </div>
                <div class="row justify-center align-center">
                    <q-form
                        class="form"
                        @submit.prevent="login"
                    >
                        <q-btn
                            class="form__submit"
                            no-caps
                            rounded
                            color="accent"
                            type="submit"
                            :loading="loading"
                        >
                            Login with Google
                            <template #loading>
                                <q-spinner
                                    color="white"
                                    size="1.5rem"
                                />
                            </template>
                        </q-btn>
                        <div class="form__login">
                            Ainda não cadastrado?
                            <router-link to="/register">
                                Clique aqui e crie sua conta.
                            </router-link>
                        </div>
                    </q-form>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<style lang="scss" scoped>
.page{
    padding-top: 8rem;
}
.form {
    max-width: 500px;
    width: 100%;

    &__contents {
        gap: 2rem;
        margin-top: 5rem;
    }

    &__submit {
        margin-top: 2rem;
        width: 100%;
        height: 50px;

        font-size: 13pt;
    }
    &__login {
        width: 100%;
        text-align: center;
        font-size: 13px;
        margin-top: .7rem;

        & > a {
            color: $accent;
        }
    }
}

.card-wrapper {
    max-width: 500px;
    width: 100%;
    padding: 2rem;
}
</style>
