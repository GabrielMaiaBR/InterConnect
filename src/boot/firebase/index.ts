import { initializeApp } from 'firebase/app';
import { boot } from 'quasar/wrappers';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(() => {
    initializeApp({
        apiKey: 'AIzaSyASYvBuSGHcfOyr6eDeX3mRc1uHLMk5Kgo',
        authDomain: 'inter-connect-5aa5f.firebaseapp.com',
        projectId: 'inter-connect-5aa5f',
        storageBucket: 'inter-connect-5aa5f.appspot.com',
        messagingSenderId: '893189526534',
        appId: '1:893189526534:web:51e7fad8b75304c0f4df87',
        measurementId: 'G-1SSH6VVFSE',
    });
});
