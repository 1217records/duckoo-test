import { onepieceTheme } from "./onepiece";
import { lolTheme } from "./lol";
import { fmaTheme } from "./fma";
import { pokemonTheme } from "./pokemon";
import { diablo2Theme } from "./diablo2";
import { sololevelingTheme } from "./sololeveling";
import { mcuTheme } from "./mcu";
import { aotTheme } from "./aot";
import { slamdunkTheme } from "./slamdunk";
import { hxhTheme } from "./hxh";
import { bleachTheme } from "./bleach";
import { lotrTheme } from "./lotr";
import type { Theme } from "./types";

const themes: Record<string, Theme> = {
  [onepieceTheme.id]: onepieceTheme,
  [lolTheme.id]: lolTheme,
  [fmaTheme.id]: fmaTheme,
  [pokemonTheme.id]: pokemonTheme,
  [diablo2Theme.id]: diablo2Theme,
  [sololevelingTheme.id]: sololevelingTheme,
  [mcuTheme.id]: mcuTheme,
  [aotTheme.id]: aotTheme,
  [slamdunkTheme.id]: slamdunkTheme,
  [hxhTheme.id]: hxhTheme,
  [bleachTheme.id]: bleachTheme,
  [lotrTheme.id]: lotrTheme,
};

export function getTheme(themeId: string): Theme | null {
  return themes[themeId] ?? null;
}

export function getThemes(): Theme[] {
  return Object.values(themes);
}
