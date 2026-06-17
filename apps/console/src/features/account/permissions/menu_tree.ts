export const filterMenuTreeByAccess = <
  T extends {
    perms?: string;
    disabled?: boolean;
    hidden?: boolean;
    children?: T[];
  }
>(
  menus: T[],
  canAccessMenu: (_menu: { perms?: string; disabled?: boolean; hidden?: boolean }) => boolean
): T[] => {
  return menus.flatMap(menu => {
    if (menu.disabled || menu.hidden) return [];

    const children = menu.children?.length
      ? filterMenuTreeByAccess(menu.children, canAccessMenu)
      : [];
    const hasDirectAccess = canAccessMenu(menu);

    if (!hasDirectAccess && children.length === 0) return [];

    if (!menu.children?.length) return [menu];

    return [{ ...menu, children }];
  }) as T[];
};
