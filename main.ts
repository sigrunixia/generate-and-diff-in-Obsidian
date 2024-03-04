import { Plugin, TFile } from 'obsidian';

export default class DiffAndComparePlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'generate-file-list',
			name: 'Generate File List',
			callback: () => this.generateFileList(),
		});

		this.addCommand({
			id: 'compare-files',
			name: 'Compare Files',
			callback: () => this.compareFiles(),
		});
	}

	getDeviceName(): string {
		const platform = navigator.platform.toLowerCase();
		if (platform.includes('win')) return 'Windows';
		if (platform.includes('mac')) return 'Mac';
		if (platform.includes('linux')) return 'Linux';
		if (platform.includes('iphone') || platform.includes('ipad')) return 'iOS';
		if (platform.includes('android')) return 'Android';
		return 'Unknown';
	}

	async generateFileList() {
		const files = this.app.vault.getFiles();
		let fileContent = '# File List\n\n';

		for (const file of files) {
			if (file instanceof TFile) {
				const fileStats = file.stat;
				fileContent += `- **Path**: ${file.path} | **Last Modified**: ${new Date(fileStats.mtime).toLocaleString()}\n`;
			}
		}

		const deviceName = this.getDeviceName();
		const timestamp = new Date().toISOString().replace(/:/g, '-');
		const directoryPath = 'diff-and-compare';
		const fileName = `${directoryPath}/${timestamp}-${deviceName}.md`;

		// Check if the directory exists, and create it if it doesn't
		const directoryExists = await this.app.vault.adapter.exists(directoryPath);
		if (!directoryExists) {
			await this.app.vault.createFolder(directoryPath);
		}

		await this.app.vault.create(fileName, fileContent);
	}

	async compareFiles() {
		const directoryPath = 'generate-and-compare';
		const resultsDirectoryPath = `${directoryPath}/results`;
		const fileList = this.app.vault.getFiles().filter(file => file.path.startsWith(directoryPath + '/') && !file.path.startsWith(resultsDirectoryPath + '/'));

		// Read the contents of each file and store them in a map
		const fileContentsMap = new Map<string, Set<string>>();
		for (const file of fileList) {
			const content = await this.app.vault.read(file);
			const lines = content.split('\n').filter(line => line.startsWith('- **Path**:'));
			const filePaths = new Set(lines.map(line => line.split('|')[0].trim().replace('- **Path**:', '').trim()));
			fileContentsMap.set(file.name, filePaths);
		}

		// Compare the file paths and find differences
		let comparisonResults = '# Comparison Results\n\n';
		fileContentsMap.forEach((filePaths, fileName) => {
			comparisonResults += `## Differences in ${fileName}\n\n`;
			fileContentsMap.forEach((otherFilePaths, otherFileName) => {
				if (fileName !== otherFileName) {
					const missingInOther = Array.from(filePaths).filter(path => !otherFilePaths.has(path));
					if (missingInOther.length > 0) {
						comparisonResults += `### Missing in ${otherFileName}\n`;
						missingInOther.forEach(missingPath => {
							comparisonResults += `- ${missingPath}\n`;
						});
						comparisonResults += '\n';
					}
				}
			});
		});

		const timestamp = new Date().toISOString().replace(/:/g, '-');
		const resultsFileName = `${resultsDirectoryPath}/${timestamp}-comparison-results.md`;

		// Ensure the results directory exists
		const resultsDirectoryExists = await this.app.vault.adapter.exists(resultsDirectoryPath);
		if (!resultsDirectoryExists) {
			await this.app.vault.createFolder(resultsDirectoryPath);
		}

		await this.app.vault.create(resultsFileName, comparisonResults);
	}



}
