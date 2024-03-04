/// <reference path="src/types.ts" />

// Import from Obsidian API
import {Plugin} from 'obsidian';

// Import from SRC
import {DIRECTORY_PATH, RESULTS_DIRECTORY_PATH} from 'src/constants';
import {GenerateDiffPluginUtils} from 'src/utils';

// Create Plugin wrapper
export default class GenerateDiffPlugin extends Plugin {
    // Plugin is loaded
    async onload() {
        // Print that the plugin has been loaded
        console.log("Loading Generate and Diff " + this.manifest.version);

        // Add a command to generate file list to command palette
        this.addCommand({
            // Give it an id
            id: 'generate-file-list', // Give it a name
            name: 'Generate File List', // Give it a callback
            callback: () => this.generateFileList(),
        });

        // Add a command to compare files to command palette
        this.addCommand({
            // Give it an id
            id: 'compare-files', // Give it a name
            name: 'Compare Files', // Give it a callback
            callback: () => this.compareFiles(),
        });
        // Nothing else we need to do
    }

    /* Functions needed for the commands below to work */

    // Directory Check
    async ensureDirectoryExists(path: string) {
        const dirs = path.split('/');
        let currentPath = '';

        for (const dir of dirs) {
            currentPath += dir + '/';
            const existingFolder = this.app.vault.getAbstractFileByPath(currentPath);

            if (!existingFolder) {
                console.log(`Creating folder: ${currentPath}`);
                await this.app.vault.createFolder(currentPath);
            } else {
                console.log(`Folder already exists: ${currentPath}`);
            }
        }
    }


    /* Now we move onto running the commands */

    // Generate file list once the command is called
    async generateFileList() {
        // Get all the files in the vault and call it with files
        const files = this.app.vault.getFiles();
        // Create a file content
        let fileContent = '# File List\n\n';

        // Loop through the files recursively
        for (const file of files) {
            // Get the file stats
            const fileStats = file.stat;
            // Add the file path and last modified date to the file content
            fileContent += `- **Path**: ${file.path} | **Last Modified**: ${new Date(fileStats.mtime).toLocaleString()}\n`;
            // End loop
        }

        // Get the device name
        const deviceName = GenerateDiffPluginUtils.getDeviceName();
        // Get the timestamp
        const timestamp = GenerateDiffPluginUtils.formatDate(new Date());
        // Create the file name
        const fileName = `${DIRECTORY_PATH}/${timestamp}-${deviceName}.md`;

        // Ensure the directory exists, and if not, create it
        const directoryExists = await this.app.vault.adapter.exists(DIRECTORY_PATH);
        if (!directoryExists) {
            await this.app.vault.createFolder(DIRECTORY_PATH);
        }

        // try and catch for file generation
        try {
            await this.app.vault.create(fileName, fileContent);
            console.log(`File list generated: ${fileName}`);
        } catch (error) {
            console.error(`Error generating file list: ${error}`);
        }
    }

    // compare files once the command is called
    async compareFiles() {
        // Get all the files in the vault and call it with files
        const fileList = this.app.vault.getFiles().filter(file => file.path.startsWith(DIRECTORY_PATH + '/') && !file.path.startsWith(RESULTS_DIRECTORY_PATH + '/'));
        // Create a file map
        let fileMap: { [key: string]: string[] } = {};

        // Loop through the files recursively
        for (const file of fileList) {
            // Get the file content
            const fileContent = await this.app.vault.read(file);
            // Get the lines and determine where linebreaks are
            const lines = fileContent.split('\n').filter(line => line.startsWith('- **Path**:'));
            // Get the device name
            const deviceName = file.name.split('-').pop()?.split('.')[0] ?? 'Unknown';

            // Loop through the lines
            for (const line of lines) {
                // Get the file path
                const filePath = line.split('|')[0].trim().replace('- **Path**: ', '');
                // If the file path doesn't exist in the file map, create an empty array
                if (!fileMap[filePath]) {
                    // Create an empty array
                    fileMap[filePath] = [];
                }
                // Push the device name to the file map
                fileMap[filePath].push(deviceName);
            }
            // End loop
        }

        // Create a comparison results
        let comparisonResults = '# Comparison Results\n\n';
        // Loop through the file map
        for (const [filePath, devices] of Object.entries(fileMap)) {
            // If the file exists on only one device
            if (devices.length === 1) {
                // Add the comparison results
                comparisonResults += `- **Path**: ${filePath} | **Exists on**: ${devices[0]}\n`;
            }
            // End loop
        }

        // Get the timestamp
        const timestamp = GenerateDiffPluginUtils.formatDate(new Date());
        // Create the results file name
        const resultsFileName = `${RESULTS_DIRECTORY_PATH}/${timestamp}-comparison-results.md`;

        // Ensure the results directory exists
        const resultsDirectoryExists = await this.app.vault.adapter.exists(RESULTS_DIRECTORY_PATH);
        if (!resultsDirectoryExists) {
            await this.app.vault.createFolder(RESULTS_DIRECTORY_PATH);
        }


        // Create the results file
        await this.app.vault.create(resultsFileName, comparisonResults);

        // Log the comparison results
        console.log("Your results have been compared.");
    }

	async onunload() {
		console.log('Unloading Generate and Diff');
	}
}
