// /util/configConsts.ts

import { useUserData } from './userDataLogic';

export const generalConfigConsts = (config: any) => {
  const { userData, loading: userLoading, error } = useUserData();

  // Add loading or error handling if necessary
  if (userLoading || !userData) {
    return {
      pageTitle: 'Loading...',
      displayName: 'Loading...',
      description: null,
      animatedTitle: false,
      typingDesc: false,
    };
  }

  const pageTitle = (config?.page_title !== undefined && config.page_title !== null) 
    ? `${config.page_title}` 
    : `${userData.username}'s profile`; // Default to user's username if config is missing

  const displayName = (config?.display_name !== undefined && config.display_name !== "")
    ? `${config.display_name}`
    : `${userData.username}`;

  const description = (config?.description !== undefined && config.description !== null)
    ? config.description
    : null;

  const animatedTitle = (config?.animated_title !== undefined && config.animated_title !== null)
    ? config.animated_title
    : false;

  const typingDesc = (config?.typing_desc !== undefined && config.typing_desc !== null)
    ? config.typing_desc
    : false;

  return { pageTitle, displayName, description, animatedTitle, typingDesc };
};