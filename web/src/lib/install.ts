/** Canonical install command, single-sourced so the 3 install pills never drift.
 * Decision B1: no npm — the one true path is the curl installer. The getctx.sh/
 * install.sh endpoint is wired up in celados/getctx.sh#1 (launch gate). */
export const INSTALL_CMD = "curl -fsSL getctx.sh/install.sh | sh"
