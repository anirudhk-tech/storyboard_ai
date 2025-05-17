<script lang="ts">
 import {
  Button,
 } from "$lib/components/ui/button/index.js";
 import * as Dialog from "$lib/components/ui/dialog/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
	import { changeBoardId, toggleSaveDialog } from "$lib/services/dialogServices";
	import { boardStore, dialogStore } from "../../svelteBridge";

 $: open = $dialogStore.saveDialogOpen;
 $: boardId = $boardStore.boardId ? $boardStore.boardId : "";

 const onOpenChange = (open: boolean) => {
    toggleSaveDialog(open);
    };

const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    changeBoardId(target.value);
  };

const handleSave = () => {
    toggleSaveDialog(false);
};

const handleLoad = () => {
    toggleSaveDialog(false); // temporary
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
    <Input id="username" placeholder="sparkly-unicorn" value={boardId} on:change={onChange} class="col-span-3" />
   </div>
  </div>
  <Dialog.Footer>
    <Button on:click={handleLoad}>Load</Button>
    <Button on:click={handleSave}>Save</Button>
  </Dialog.Footer>
 </Dialog.Content>
</Dialog.Root>