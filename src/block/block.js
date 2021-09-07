/**
 * BLOCK: opdracht1-carflow
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import React from "react";
import { Toolbar } from "@wordpress/components";

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const { __, _x } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { MediaUpload, PlainText, MediaPlaceholder, InnerBlocks, BlockControls } =
	wp.blockEditor;

const TEMPLATE = [
	[
		"core/paragraph",
		{
			placeholder: _x("Content…", "content placeholder"),
		},
	],
];

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("schakel-opdrachten/opdracht-1-carflow", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __("Opdracht 1 & 2 - Carflow"), // Block title.
	icon: "shield", // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: "common", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [__("carflow"), __("media-text")],
	attributes: {
		title: {
			type: "string",
			source: "text",
			selector: ".carflow-block__title",
		},
		imageAlt: {
			attribute: "alt",
			selector: ".carflow-block__image",
		},
		imageUrl: {
			attribute: "src",
			selector: ".carflow-block__image",
		}
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */

	edit: ({ attributes, className, setAttributes }) => {
		const toggleImagePlaceholder = (openEvent) => {
			if (attributes.imageUrl) {
				return (
					<img
						src={attributes.imageUrl}
						onClick={openEvent}
						className="image"
					/>
				);
			} else {
				return (
					<MediaPlaceholder
						onSelect={(media) => {
							setAttributes({ imageAlt: media.alt, imageUrl: media.url });
						}}
						allowedTypes={["image"]}
						multiple={false}
						labels={{ title: "Upload an image" }}
					></MediaPlaceholder>
				);
			}
		};

		const toolbarControls = [];

		return (
			<React.Fragment>
				<BlockControls>
					<Toolbar controls={toolbarControls} />
				</BlockControls>

				<div className={className}>
					<div className="carflow-block__content-wrapper">
						<div className="carflow-block__img-wrapper">
							<MediaUpload
								onSelect={(media) => {
									setAttributes({ imageAlt: media.alt, imageUrl: media.url });
								}}
								type="image"
								value={attributes.imageID}
								render={({ open }) => toggleImagePlaceholder(open)}
							/>
						</div>
						<div className="carflow-block__content">
							<h3 className="carflow-block__title">
								<PlainText
									onChange={(content) => setAttributes({ title: content })}
									value={attributes.title}
									placeholder={__("carflow Title")}
									className="heading"
								/>
							</h3>
							<InnerBlocks template={TEMPLATE} />
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ({ attributes }) => {
		const cardImage = (src, alt) => {
			if (!src) return null;

			if (alt) {
				return <img className="carflow-block__image" src={src} alt={alt} />;
			}

			// No alt set
			return <img className="carflow-block__image" src={src} alt="" />;
		};

		const className = "carflow-block";
		return (
			<div className={className}>
				<div className="carflow-block__content-wrapper">
					<div className="carflow-block__img-wrapper">
						{cardImage(attributes.imageUrl, attributes.imageAlt)}
					</div>
					<div className="carflow-block__content">
						<h3 className="carflow-block__title">{attributes.title}</h3>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
});
