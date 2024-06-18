import React, { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Icons,
  ShellHeader,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { Menu } from '@ncobase/types';
import { useTranslation } from 'react-i18next';

import { MainNavigation, TenantDropdown, AccountDropdown } from '../navigation';

import { useMenus } from './page.context';

import { LanguageSwitcher } from '@/components/language_switcher';
import { Logo } from '@/components/logo';
import { useQueryMenuTreeData } from '@/features/system/menu/service';

const HeaderComponent = ({ ...rest }) => {
  const { t } = useTranslation();
  const [, setMenus] = useMenus();

  const [headerMenus, setHeaderMenus] = useState<Menu[]>([]);
  const { data: menusData = [] } = useQueryMenuTreeData({ type: 'header' });

  useEffect(() => {
    if (!menusData?.length) return;
    setMenus(menusData);
    setHeaderMenus(menusData.filter(menu => menu.type === 'header'));
  }, [menusData.length, setMenus]);

  const notifications = [
    {
      title: '您有个待办需要处理。',
      description: t('datetime.now')
    },
    {
      title: '您有一条新信息！',
      description: t('datetime.minutes_ago_with_value', { minutes: 5 })
    },
    {
      title: '您的订阅即将到期！',
      description: t('datetime.days_ago_with_value', { days: 2 })
    }
  ];

  return (
    <ShellHeader
      className='flex items-center justify-between bg-gradient-to-r border-b-0 from-slate-800 via-slate-700 via-20% to-slate-800'
      {...rest}
    >
      <div className='inline-flex items-center justify-start'>
        <Logo className='w-14 h-14 bg-slate-900' type='min' height='2.625rem' color='white' />
        {headerMenus.length ? <MainNavigation menus={headerMenus} /> : null}
      </div>
      <div className='inline-flex items-center px-4 gap-x-3'>
        <LanguageSwitcher />
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              variant='unstyle'
              size='xs'
              className='relative text-slate-400/70 [&>svg]:stroke-slate-400/70'
            >
              <Badge className='absolute -top-1 -right-1 text-[9px] !px-1' size='xs'>
                3
              </Badge>
              <Icons name='IconBell' className='stroke-slate-500/85' />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className='p-0'>
            <CardHeader className='flex-row justify-between'>
              <div className='inline-flex flex-col space-y-1.5'>
                <CardTitle>{t('notification.title')}</CardTitle>
                <CardDescription>
                  {t('notification.you_have_unread_notification_plural', { count: 3 })}
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch />
                </TooltipTrigger>
                <TooltipContent side='bottom'>{t('notification.push_setting')}</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className='grid gap-4 max-h-[7.5rem] mb-6 !overflow-auto'>
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className='grid grid-cols-[22px_1fr] items-start last:mb-0 last:pb-0'
                >
                  <Badge size='sm' className='mt-3' />
                  <div className='space-y-1'>
                    <Button
                      variant='link'
                      size='sm'
                      className='text-sm text-slate-700 px-0 leading-5 text-justify text-wrap'
                    >
                      {notification.title}
                    </Button>
                    <p className='text-xs text-slate-400'>{notification.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className='w-full'>
                <Icons name='IconCheck' /> {t('actions.mark_all_as_read')}
              </Button>
            </CardFooter>
          </HoverCardContent>
        </HoverCard>
        <TenantDropdown />
        <AccountDropdown />
      </div>
    </ShellHeader>
  );
};
export const Header = React.memo(HeaderComponent);
