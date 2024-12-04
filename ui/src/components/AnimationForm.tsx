import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import { LottieRefCurrentProps } from 'lottie-react';

type AnimationFormProps = {
  animData: object;
  label: string;
  onSelect: () => void;
  isSelected: boolean;
  autoplay?: boolean;
};

const AnimationForm: React.FC<AnimationFormProps> = ({ animData, label, onSelect, isSelected, autoplay = false }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handlePlay = () => {
    lottieRef.current?.play();
  };

  const handlePause = () => {
    lottieRef.current?.goToAndStop(0, true);
  };

  const handleMouseEnter = () => {
    handlePlay();
  };

  const handleMouseLeave = () => {
    if (isSelected) return;
    handlePause();
  };

  useEffect(()=> {
    if (isSelected) handlePlay();
    else handlePause();
  }, [isSelected]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onClick={onSelect}
      onMouseLeave={handleMouseLeave}
      className={`rounded-sm p-4 w-fit flex flex-col items-center cursor-pointer ${isSelected ? 'border-4 border-pink-400 bg-base-200' : 'hover:bg-base-200'}`} // Se agrega un borde si está seleccionado
    >
      <div className='w-20'>
        <Lottie
          lottieRef={lottieRef}
          animationData={animData}
          autoplay={autoplay}
          loop={true}
        />
      </div>
      <p>{label}</p>
    </div>
  );
};

export { AnimationForm };
