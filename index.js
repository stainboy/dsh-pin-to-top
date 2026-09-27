/**
 * Host half of the plugin.
 *
 * This plugin has no Host behavior. Keeping an empty Host entry lets Cordis
 * own its lifecycle while DSH discovers the browser half through
 * package.json's dsh.client declaration and exports["./client"].
 */
export function apply() {}
