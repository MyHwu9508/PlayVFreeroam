<script lang="ts">
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import { Stepper, Step, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
  import DataPrivacy from '../lib/components/registerWindow/DataPrivacy.svelte';
  import TermsOfService from '../lib/components/registerWindow/TermsOfService.svelte';
  import { fly } from 'svelte/transition';
  import { rules } from './script/rules';

  let acceptedTOS = false;
  let visible = false;
  let acceptedRules = false;

  alt.on('register:openWindow', (state) => {
    visible = state;
  });

  function continueWithLogin() {
    alt.emit('continueWithLogin');
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed flex h-full w-full select-none items-end justify-center" transition:fly={{ duration: 500, y: 500 }}>
    <div class="bg-surface-700/40 rounded-container-token w-[50rem] p-2">
      <Stepper
        stepTerm="Step"
        buttonNextLabel="<div>Next <span class='i-carbon-arrow-right align-[-0.125rem]'></span></div>"
        buttonBackLabel="<div><span class='i-carbon-arrow-left align-[-0.125rem]'></span>Back</div>"
        buttonCompleteLabel="Login"
        on:complete={continueWithLogin}
      >
        <Step>
          <svelte:fragment slot="header">Welcome on PlayV.mp</svelte:fragment>
          <Accordion class="bg-surface-700/80 h-[20rem] overflow-auto" autocollapse>
            <AccordionItem open>
              <svelte:fragment slot="lead"
                ><img src="img/registerWindow/joystick.png" alt="" class="w-5" /></svelte:fragment
              >
              <svelte:fragment slot="summary"><p class="font-bold">What can you do on this server?</p></svelte:fragment>
              <svelte:fragment slot="content"
                ><p>
                  Explore breathtaking landscapes, roam the city, customize your vehicles or characters, and showcase
                  your skills in thrilling chases. The possibilities are endless!
                </p></svelte:fragment
              >
            </AccordionItem>
            <AccordionItem>
              <svelte:fragment slot="lead"
                ><img src="img/registerWindow/passion.png" alt="" class="w-5" /></svelte:fragment
              >
              <svelte:fragment slot="summary"><p class="font-bold">What we stand for.</p></svelte:fragment>
              <svelte:fragment slot="content"
                ><p>
                  Our server is not only a place to indulge in your gaming passion but also a friendly and helpful
                  community that supports you. We value respectful interactions and want every player to feel
                  comfortable and welcomed.
                </p></svelte:fragment
              >
            </AccordionItem>
            <AccordionItem>
              <svelte:fragment slot="lead"><img src="img/registerWindow/faq.png" alt="" class="w-5" /></svelte:fragment>
              <svelte:fragment slot="summary"><p class="font-bold">Where can you get help?</p></svelte:fragment>
              <svelte:fragment slot="content"
                ><p>
                  Join our Discord Server and open a ticket in the #support channel. Our staff will be happy to help
                  you.
                </p>

                <a class="logo-item h-10" href="https://playv.mp/discord" target="_blank">
                  <img src="img/registerWindow/discord.png" alt="" class="w-10" />
                  <span>Join our Discord</span>
                </a>
              </svelte:fragment>
            </AccordionItem>
          </Accordion>
        </Step>
        <Step>
          <svelte:fragment slot="header">Data Privacy</svelte:fragment>
          <div class="bg-surface-700/80 flex h-[30rem] flex-col justify-between p-2">
            <div class="overflow-auto">
              <DataPrivacy />
            </div>
          </div>
        </Step>
        <Step locked={!acceptedTOS}>
          <svelte:fragment slot="header">Terms of Service</svelte:fragment>
          <div class="bg-surface-700/80 flex h-[30rem] flex-col justify-between p-2">
            <div class="overflow-auto"><TermsOfService /></div>

            <div class="flex items-center pt-2">
              <input id="acceptTOS" type="checkbox" class="checkbox" bind:checked={acceptedTOS} />
              <label for="acceptTOS" class="cursor-pointer pl-2 text-xl"
                >I have read and accept the Terms of Service.</label
              >
            </div>
          </div>
        </Step>
        <Step locked={!acceptedRules}>
          <svelte:fragment slot="header">Rules</svelte:fragment>
          <div class="bg-surface-700/80 flex h-[30rem] w-full flex-col justify-between p-2">
            <div class="overflow-y-auto overflow-x-hidden">
              <ul class="list list-inside list-disc">
                {#each rules as rule}
                  <li class="bg-surface-500/80 p-2">{rule}</li>
                {/each}
              </ul>
            </div>
            <div class="flex items-center pt-2">
              <input id="acceptedRules" type="checkbox" class="checkbox" bind:checked={acceptedRules} />
              <label for="acceptedRules" class="cursor-pointer pl-2 text-xl"
                >I have read and accept the server rules.</label
              >
            </div>
          </div>
        </Step>
      </Stepper>
    </div>
  </div>
{/if}
