<script lang="ts">
	import Textfield from '@smui/textfield';
	let valueTypeFiles: FileList | null = null;

	// Note: the change and input events fire before the `files` prop is updated.
	$: if (valueTypeFiles != null && valueTypeFiles.length) {
		alert('Selected ' + valueTypeFiles.length + ' file(s).');
	}
</script>

<h1>Demo</h1>

<div class="hide-file-ui">
	<!--
    Note: the change and input events fire
    before the `files` prop is updated.
  -->
	<Textfield bind:files={valueTypeFiles} label="File" type="file" />
</div>

<style>
	.hide-file-ui :global(input[type='file']::file-selector-button) {
		display: none;
	}

	.hide-file-ui :global(:not(.mdc-text-field--label-floating) input[type='file']) {
		color: transparent;
	}
</style>
