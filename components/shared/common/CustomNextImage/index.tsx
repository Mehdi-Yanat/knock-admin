import Image from 'next/image';
import { ImageProps } from 'next/dist/client/image.d';
import { useState } from 'react';
import { websiteBasePath } from '@utils/core/next-seo.config';

export interface ICustomNextImageProps extends Omit<ImageProps, 'alt'> {
	className?: string;
	placeholder?: 'blur' | 'empty';
	role?: string;
	alt?: string;
	weservNlOptimized?: boolean;
	isAnimated?: boolean;
	src:string;
}

const CustomNextImage = ({
	className = '',
	unoptimized = true,
	weservNlOptimized = true,
	src,
	alt = '',
	placeholder = 'empty',
	blurDataURL,
	isAnimated,
	...props
}: ICustomNextImageProps) => {
	const [isWeservNlOptimized, setIsWeservNlOptimized] =
		useState(weservNlOptimized);
	const [_src, setSrc] = useState(src);
	const [isLoaded, setIsLoaded] = useState(false);

	const handleImageProps = () => {
		const imageProps: Omit<ICustomNextImageProps, 'alt'> & { alt: string } = {
			onError: () => {
				if (isWeservNlOptimized) {
					setIsLoaded(true);
					setIsWeservNlOptimized(false);
					return;
				}

				setIsLoaded(true);
				setSrc(
					// '/images/image-error.png'
					'/svg/bbblurry.svg'
				);
			},
			unoptimized,
			src:
				isWeservNlOptimized && typeof _src === 'string'
					? `//images.weserv.nl/?url=${encodeURIComponent(
							_src.startsWith('/') ? `${websiteBasePath}${_src}` : _src
					  )}&w=${props.width}${props.height ? `&h=${props.height}` : ''}${
							isAnimated ? '&n=-1' : ''
					  }`
					: _src,
			placeholder,
			className: `${className} ${isLoaded ? '' : 'no-content'}`,
			alt: '',
			onLoadingComplete: (img) => {
				setIsLoaded(true);
			},
			...props
		};

		if (placeholder !== 'empty') {
			if (blurDataURL) imageProps.blurDataURL = blurDataURL;
			else if (src && typeof src === 'string') imageProps.blurDataURL = src;
		}

		return imageProps;
	};

	// eslint-disable-next-line jsx-a11y/alt-text
	return <Image {...handleImageProps()} />;
};

export default CustomNextImage;
