<script lang="ts">
	import DDImageInput from '$lib/components/DDImageInput.svelte';

	let selectedImage: File | null = null;

	const downloadImage = () => {
		if (selectedImage) {
			const link = document.createElement('a');
			link.href = URL.createObjectURL(selectedImage);
			link.download = selectedImage.name;
			link.click();
		}
	};

	const onImageChangeHandler = (image: File | null) => {
		selectedImage = image;
	};
</script>

<div class="root">
	<h1>Demo</h1>

	<button on:click={downloadImage}>Download Image</button>

	<DDImageInput onChange={onImageChangeHandler} />
</div>

<style>
	.root {
		padding: 8px;
	}

	:global(.main.main-container) {
		overflow: auto;
	}
</style>
