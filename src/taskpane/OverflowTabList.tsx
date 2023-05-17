import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tab,
  TabList,
  useIsOverflowItemVisible,
  useOverflowMenu,
  Overflow,
  OverflowItem,
} from "@fluentui/react-components";
import * as React from "react";

import { MoreHorizontalRegular, MoreHorizontalFilled, bundleIcon } from "@fluentui/react-icons";
import { MenuTab } from "./components/App";

const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular);

//----- OverflowMenuItem -----//

type OverflowMenuItemProps = {
  tab: MenuTab;
  onClick: React.MouseEventHandler;
};

/**
 * A menu item for an overflow menu that only displays when the tab is not visible
 */
const OverflowMenuItem = (props: OverflowMenuItemProps) => {
  const { tab, onClick } = props;
  const isVisible = useIsOverflowItemVisible(tab.id);

  if (isVisible) {
    return null;
  }

  return (
    <MenuItem key={tab.id} icon={tab.icon} onClick={onClick}>
      <div>{tab.name}</div>
    </MenuItem>
  );
};

//----- OverflowMenu -----//

const useOverflowMenuStyles = makeStyles({
  menu: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  menuButton: {
    alignSelf: "center",
  },
});

type OverflowMenuProps = {
  tabs: MenuTab[];
  onTabSelect?: (tabId: string) => void;
};

/**
 * A menu for selecting tabs that have overflowed and are not visible.
 */
const OverflowMenu = (props: OverflowMenuProps) => {
  const { tabs, onTabSelect } = props;
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  const styles = useOverflowMenuStyles();

  const onItemClick = (tabId: string) => {
    onTabSelect?.(tabId);
  };

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="outline"
          className={styles.menuButton}
          ref={ref}
          icon={<MoreHorizontal />}
          aria-label={`${overflowCount} more tabs`}
          role="tab"
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList className={styles.menu}>
          {tabs.map((tab) => (
            <OverflowMenuItem key={tab.id} tab={tab} onClick={() => onItemClick(tab.id)} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

//----- Stories -----//

const useOverflowTabListStyles = makeStyles({
  container: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.overflow("hidden"),
    ...shorthands.padding("5px"),
    zIndex: 0, //stop the browser resize handle from piercing the overflow menu
  },
});

type OverflowTabListProps = {
  tabs: MenuTab[];
  selectedTabId: string;
  setSelectedTabId: (tabId: string) => void;
};

export const OverflowTabList = ({ tabs, selectedTabId, setSelectedTabId }: OverflowTabListProps) => {
  const styles = useOverflowTabListStyles();

  const onTabSelect = (tabId: string) => {
    setSelectedTabId(tabId);
  };

  return (
    <div className={styles.container}>
      <Overflow minimumVisible={2}>
        <TabList selectedValue={selectedTabId} onTabSelect={(_, d) => onTabSelect(d.value as string)}>
          {tabs.map((tab) => {
            return (
              <OverflowItem key={tab.id} id={tab.id} priority={tab.id === selectedTabId ? 2 : 1}>
                <Tab value={tab.id} icon={<span>{tab.icon}</span>}>
                  {tab.name}
                </Tab>
              </OverflowItem>
            );
          })}
          <OverflowMenu tabs={tabs} onTabSelect={onTabSelect} />
        </TabList>
      </Overflow>
    </div>
  );
};
