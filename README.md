# Generate and Diff

Generate and Diff is an Obsidian plugin designed for a specific purpose: to generate notes of your file tree across multiple devices and compare them to identify differences.

I developed this plugin to assist Obsidian users who rely on syncing services in pinpointing files that failed to transfer successfully between devices. This is an ***opinionated*** plugin, meaning you cannot change any of the settings or customize it. 

> Please note that this plugin is designed for troubleshooting purposes only and does not resolve syncing issues.

## Using this plugin

The Obsidian Core Plugin [Command Palette](https://help.obsidian.md/Plugins/Command+palette) is required to be enabled to use this plugin.
### Generating the Notes

Perform the following steps for each device you wish to generate a note for:

1. Open the command palette and search for **Generate**.
2. Choose `Generate and Diff: Generate File List`.
3. The plugin will create a note with your current device's file tree in the top-level folder `generate-and-diff`. It will create the folder if it doesn't exist.
### Running the Comparison

After generating the files for comparison from each device, follow these steps on one device:

1. Open the command palette and search for **Compare**.
2. Choose `Generate and Diff: Compare Files`.
3. The plugin will create a note with the differences between each device's file tree in `generate-and-diff/results`. It will create the folder if it doesn't exist.

### Deleting the Directory

To ensure a fresh start for the next comparison, delete the `generate-and-diff` directory when you have completed your comparison.
## Installing the plugin

TBD
