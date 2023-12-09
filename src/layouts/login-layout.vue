<script setup lang="ts">


</script>

<template>
    <q-layout view="hHh lpR fFf">
        <q-page-container>
            <router-view v-slot="{ Component }">
                <transition name="slide-left">
                    <component
                        :is="Component"
                    />
                </transition>
            </router-view>
        </q-page-container>
    </q-layout>
</template>
