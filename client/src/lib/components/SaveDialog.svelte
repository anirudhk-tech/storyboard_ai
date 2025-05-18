<script lang="ts">
 import {
  Button,
 } from "$lib/components/ui/button/index.js";
 import * as Dialog from "$lib/components/ui/dialog/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
	import { checkBoardExists, loadCards, saveCards } from "$lib/services/boardServices";
	import { changeBoardId, toggleSaveDialog } from "$lib/services/dialogServices";
	import { toast } from "svelte-sonner";
	import { boardStore, dialogStore } from "../../svelteBridge";

 $: open = $dialogStore.saveDialogOpen;
 $: boardId = $boardStore.boardId ? $boardStore.boardId : "";
 let inputId = ""

 $: if (open) {
    inputId = boardId ?? "";
  }

 const onOpenChange = (open: boolean) => {
    toggleSaveDialog(open);
    };

const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    inputId = target.value;
  };

const handleSave = async () => {
    if (boardId) {
        toast.error("This board is already saved under id " + boardId, {
          description: "Please refresh the page to save a new board.",
        })
    } else {
      const checkExists = await checkBoardExists(inputId);

      if (checkExists) {
        toast.error("This board already exists.", {
          description: "Please choose a different one.",
        })
        return;
      }
      
      changeBoardId(inputId);
      await saveCards(inputId);
    }
    toggleSaveDialog(false);
};

const handleLoad = async () => {
    changeBoardId(inputId);
    await loadCards(inputId);
      toggleSaveDialog(false);
};
</script>
 
<Dialog.Root open={open} onOpenChange={onOpenChange}>
 <Dialog.Content class="sm:max-w-[425px]">
  <Dialog.Header>
   <Dialog.Title>Save/Load Changes</Dialog.Title>
   <Dialog.Description>
    Enter a unique id to save or load your board. Make sure to remember it if you're saving!
   </Dialog.Description>
  </Dialog.Header>
  <div class="grid gap-4 py-4">
   <div class="grid grid-cols-4 items-center gap-4">
    <Input id="username" placeholder="sparkly-unicorn" bind:value={inputId} on:change={onChange} class="col-span-3" />
   </div>
  </div>
  <Dialog.Footer>
    <Button on:click={handleLoad} disabled={!inputId}>Load</Button>
    <Button on:click={handleSave} disabled={!inputId}>Save</Button>
  </Dialog.Footer>
 </Dialog.Content>
</Dialog.Root>