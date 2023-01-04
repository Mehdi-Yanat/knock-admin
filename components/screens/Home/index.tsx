import { IHomePageProps } from '@pages/index';
import {
	AboutSection,
	HeroSection,
	OneProductShowCaseSection,
	LatestSamplesSection
} from './sections';

const HomeScreen = ({ products , openPopUp}: IHomePageProps) => {
	return (
		<>
			<HeroSection openPopUp={openPopUp} />
			<OneProductShowCaseSection />
			<AboutSection />
			<LatestSamplesSection products={products} />
		</>
	);
};

export default HomeScreen;
