import { cx } from 'class-variance-authority';

const KnockTrademark = ({isMainSection , OnLiveMainSectionChange}:{isMainSection?:boolean , OnLiveMainSectionChange?:any}) => {
	return (
		<span className='flex w-fit relative'>
			{isMainSection ? OnLiveMainSectionChange.h2  : 'KNOCK'}
			<sup
				className={cx(
					'right-0 ml-[-0.25ch] translate-x-1/4',
					'rtl:right-auto rtl:ml-0',
					'rtl:left-0 rtl:mr-[-0.25ch] rtl:-translate-x-1/4'
				)}
			>
				&reg;
			</sup>
		</span>
	);
};

export default KnockTrademark;
