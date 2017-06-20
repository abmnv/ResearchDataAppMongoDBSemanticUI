import React from 'react';

const SpinningWheel = (props) => {
  const classNamespace = 'pb-';

  return (
    <div className={`${classNamespace}container loading`}>
      <button className={classNamespace + 'button'}>
        <svg className={classNamespace + 'progress-circle'} viewBox='0 0 41 41'>
          <path d='M38,20.5 C38,30.1685093 30.1685093,38 20.5,38' />
        </svg>
      </button>
    </div>
  );
}

export default SpinningWheel;
