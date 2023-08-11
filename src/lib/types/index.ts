export interface DescriptionStates {
	raw_description: string;
	corrected_description: string;
	seo_enchanced_description: string;
	promotional_enchanced_description: string;
}

export interface ImageData {
	alt_text: string;
	caption: string;
}

export interface ImageMetaData {
	tags: string[];
	caption: string;
}

export type TranslatedDescription = Pick<
	DescriptionStates,
	'seo_enchanced_description' | 'promotional_enchanced_description'
>;

export interface ImagePayload extends DescriptionStates {
	id: string;
	url: string;
	base64?: string;
	imageData?: ImageData;
	transformations?: string[];
	translations?: Record<string, TranslatedDescription>;
}

export interface Data extends DescriptionStates {
	data: Partial<Record<string, ImagePayload>>;
	items: string[];
}
