import { Heading } from '@sb1/indeks-react';
import React from 'react';

const ResponsivSpacing: React.FC = () => {
    return (
        <div className="ix-p-md">
            <Heading as="h1">Responsiv spacing</Heading>
            <div className='ix-mt-lg ix-flex ix-items-center ix-gap-xs'>
                <span className='ix-inline-block ix-color-fill-main-default' style={{ height: '1.5rem', width: '1.5rem'  }}></span><span>= margin</span>
                <span className='ix-inline-block ix-ml-lg ix-color-fill-danger-default' style={{ height: '1.5rem', width: '1.5rem' }}></span><span>= padding</span>
            </div>
            <div className='ix-mt-xl'>
                <div className="ix-inline-block ix-color-fill-main-default">
                    <div 
                        className="ix-m-xs ix-sm-m-sm ix-md-m-md ix-lg-m-lg ix-xl-m-xl ix-p-xs ix-sm-p-sm ix-md-p-md ix-lg-p-lg ix-xl-p-xl ix-color-fill-danger-default"
                    >
                        <code style={{ backgroundColor: '#fff' }} className="ix-inline-block ix-p-2xs">
                            default: xs<br />
                            sm: sm<br />
                            md: md<br />
                            lg: lg<br />
                            xl: xl
                        </code>
                    </div>
                </div>
            </div>

            <div className='ix-mt-xl'>  
                <div className="ix-inline-block ix-color-fill-main-default">
                    <div 
                        className="ix-m-0 ix-sm-m-2xs ix-md-m-xs ix-lg-m-sm ix-xl-m-md ix-p-0 ix-sm-p-2xs ix-md-p-xs ix-lg-p-sm ix-xl-p-md ix-color-fill-danger-default"
                    >
                        <code style={{ backgroundColor: '#fff' }} className="ix-inline-block ix-p-2xs">
                            default: 0<br />
                            sm: 2xs<br />
                            md: xs<br />
                            lg: sm<br />
                            xl: md
                        </code>
                    </div>
                </div>
            </div>
            
            <div className='ix-mt-xl'>  
                <div className="ix-inline-block ix-color-fill-main-default">
                    <div 
                        className="ix-m-2xs ix-md-m-lg ix-xl-m-3xl ix-p-2xs ix-md-p-lg ix-xl-p-3xl ix-color-fill-danger-default"
                    >
                        <code style={{ backgroundColor: '#fff' }} className="ix-inline-block ix-p-2xs">
                            default: 2xs<br />
                            md: lg<br />
                            xl: 3xl
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsivSpacing;
