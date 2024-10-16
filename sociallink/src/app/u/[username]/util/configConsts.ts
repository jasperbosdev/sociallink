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

    const pfpDecoration = (config?.pfp_decoration !== undefined && config.pfp_decoration !== null)
    ? config.pfp_decoration
    : false;

    const decorationValue = (config?.decoration_value !== undefined && config.decoration_value !== null)
    ? config.decoration_value
    : null;

    const cardTilt = config?.card_tilt !== undefined && config.card_tilt !== null
    ? config.card_tilt
    : false;

    const showBadges = config?.show_badges !== undefined && config.show_badges !== null
    ? config.show_badges
    : false;

    const fullRoundedSocials = config?.rounded_socials !== undefined && config.rounded_socials !== null
    ? config.rounded_socials
    : false;

    const primaryColor = (config?.primary_color !== undefined && config.primary_color !== null)
    ? config.primary_color
    : '0, 0, 0';

    const secondaryColor = (config?.secondary_color !== undefined && config.secondary_color !== null)
    ? config.secondary_color
    : '101013';

    const accentColor = (config?.accent_color !== undefined && config.accent_color !== null)
    ? config.accent_color
    : 'FFFFFF';

    const textColor = (config?.text_color !== undefined && config.text_color !== null)
    ? config.text_color
    : 'FFFFFF';

    const backgroundColor = (config?.background_color !== undefined && config.background_color !== null)
    ? config.background_color
    : '10, 10, 13';

    const embedColor = (config?.embed_color !== undefined && config.embed_color !== null)
    ? config.embed_color
    : '09090B';

    const profileFont = (config?.profile_font !== undefined && config.profile_font !== null)
    ? config.profile_font
    : 'geistSans';
  
    return { borderWidth, borderRadius, cardOpacity, cardBlur, bgBlurValue, bgBrightnessValue, usernameFx, cardGlow, pfpDecoration, decorationValue, cardTilt, showBadges
    , fullRoundedSocials, primaryColor, secondaryColor, accentColor, textColor, embedColor, backgroundColor, profileFont
     };
};