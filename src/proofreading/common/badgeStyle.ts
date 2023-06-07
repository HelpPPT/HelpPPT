import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useBadgeStyles = makeStyles({
  badge: {
    backgroundColor: tokens.colorBrandForeground1,
    ...shorthands.margin(0, "8px", 0, "4px"),
  },
  redBadge: {
    backgroundColor: tokens.colorPaletteRedForeground1,
  },
  greenBadge: {
    backgroundColor: tokens.colorPaletteGreenForeground1,
  },
  orangeBadge: {
    backgroundColor: tokens.colorPaletteDarkOrangeForeground1,
  },
  yellowBadge: {
    backgroundColor: tokens.colorPaletteYellowBorderActive,
  },
  berryBadge: {
    backgroundColor: tokens.colorPaletteBerryForeground1,
  },
  marigoldBadge: {
    backgroundColor: tokens.colorPaletteMarigoldForeground1,
  },
  blueBadge: {
    backgroundColor: tokens.colorPaletteBlueForeground2,
  },
});
