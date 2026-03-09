import { onepieceTheme } from "./onepiece";
import { lolTheme } from "./lol";
import { fmaTheme } from "./fma";
import { pokemonTheme } from "./pokemon";
import { diablo2Theme } from "./diablo2";
import type { Theme } from "./types";

const themes: Record<string, Theme> = {
  [onepieceTheme.id]: onepieceTheme,
  [lolTheme.id]: lolTheme,
  [fmaTheme.id]: fmaTheme,
  [pokemonTheme.id]: pokemonTheme,
  [diablo2Theme.id]: diablo2Theme,
};

export function getTheme(themeId: string): Theme | null {
  return themes[themeId] ?? null;
}

export function getThemes(): Theme[] {
  return Object.values(themes);
}
