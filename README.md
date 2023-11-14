# Dictafone

## Why?
Speech to text native apps are freemium. They do a mediocre job at capturing a transcript, then ask you to pay to send the transcript or audio recording anywhere. Challenged myself to build a free version using HTML5 APIs only.

Built it 3 times. First time as plain Vanilla JS to explore the problem and stich Speech Recognition, MediaRecorder, AudioRecorder and IndexedDB APIs together. Second time as a Svelte app to get familiar with this Component framework. Third time as a SvelteKit app to learn this app framework and TailwindCSS & DaisyUI.

## Failures

Developed secondary features from the comfort of Chrome on my Mac, didn't verify on my phone (primary target) that all features worked together.

## Learnings

1. Speech Recognition event lifecycle ASCIIART

2. Chrome for Android isFinal + confidence

3. Safari for Mac isFinal + confidence



## Developing

Once you've installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
