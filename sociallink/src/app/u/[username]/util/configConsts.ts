// /util/configConsts.ts
export const configConsts = (config: any) => {
    const borderWidth = (config?.border_width !== undefined && config.border_width !== null) 
      ? `${config.border_width}px` 
      : '3px';
  
    const borderRadius = (config?.border_radius !== undefined && config.border_radius !== null) 
      ? `${config.border_radius}rem` 
      : '0.5rem';
  
    const cardOpacity = (config?.card_opacity !== undefined && config.card_opacity !== null)
      ? config.card_opacity / 100 
      : 0.9;
  
    const cardBlur = (config?.card_blur !== undefined && config.card_blur !== null)
      ? `backdrop-blur-[${config.card_blur}px]`
      : 'backdrop-blur-[0px]';
  
    const bgBlurValue = (config?.background_blur !== undefined && config.background_blur !== null)
      ? `${config.background_blur}px`
      : '0px';
  
    const bgBrightnessValue = (config?.background_brightness !== undefined && config.background_brightness !== null)
      ? config.background_brightness / 100 
      : 1;

    const usernameFx = (config?.username_fx !== undefined && config.username_fx !== null)
    ? config.username_fx
    : false;

    const cardGlow = (config?.card_glow !== undefined && config.card_glow !== null)
    ? config.card_glow
    : false;
  
    return { borderWidth, borderRadius, cardOpacity, cardBlur, bgBlurValue, bgBrightnessValue, usernameFx, cardGlow };
};  