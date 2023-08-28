<script lang="ts">
	let fileInput: HTMLInputElement | null = null;
	let selectedImage: File | null = null;
	let previewImage: string | null = null;
	export let onChange: ((image: File | null) => void) | undefined = undefined;

	const handleFileChange = () => {
		const file = fileInput?.files ? fileInput.files[0] : null;

		if (file && file.type.includes('image')) {
			previewImage = URL.createObjectURL(file);
			selectedImage = file;
		}
	};

	const handleDrop = (event: any) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];

		if (file && file.type.includes('image')) {
			previewImage = URL.createObjectURL(file);
			selectedImage = file;
		}
	};

	const handleDragOver = (event: any) => {
		event.preventDefault();
	};

	$: {
		if (onChange) {
			onChange(selectedImage);
		}
	}
</script>

<label for="fileInput" on:drop={handleDrop} on:dragover={handleDragOver} class="drop-zone">
	<input
		id="fileInput"
		type="file"
		class="hidden-input"
		bind:this={fileInput}
		on:change={handleFileChange}
		accept="image/*"
	/>

	{#if previewImage}
		<img src={previewImage} alt="Selected" class="large-image-preview" />
	{:else}
		<p>Drag and drop an image here or click to select the image</p>
	{/if}
</label>

<style>
	.drop-zone {
		border: 2px dashed var(--secondary);
		display: flex;
		flex-direction: column;
		padding: var(--gap-medium);
		text-align: center;
	}

	.large-image-preview {
		max-width: 100%;
	}

	.hidden-input {
		display: none;
	}
</style>
