import * as manifest from './manifest.js'
import process from 'process'
import * as generate_manifest from './generate_manifest.js'

export class Scraper {
    constructor(s3_creds, hf_creds, mysql_creds, local_model_path, collection_path) {
        this.env = process.env;
        if (s3_creds != undefined) {
            this.env.s3_creds = s3_creds;
            this.s3_creds = s3_creds;
        }
        if (hf_creds != undefined) {
            this.env.hf_creds = hf_creds;
            this.hf_creds = hf_creds;
        }
        if (mysql_creds != undefined) {
            this.env.mysql_creds = mysql_creds;
            this.mysql_creds = mysql_creds;
        }
        if (local_model_path != undefined) {
            this.env.local_model_path = local_model_path;
            this.local_model_path = local_model_path;
        }
        if (collection_path != undefined) {
            this.env.collection_path = collection_path;
            this.collection_path = collection_path;
        }
    }

    main() {
        let args = process.argv.slice(2);
        let command;
        let source;
        let model;

        if (args.length > 1) {
            command = args[0];
        }
        if (args.length > 2) {
            source = args[1];
        }
        if (args.length > 3) {
            model = args[2];
        }

        if (command == "-h" || command == "--help") {
            console.log("Usage: node main.js [command] [source] [model]");
            console.log("command: import");
            console.log("source: hf");
            console.log("model: model name");
            process.exit(0);
        }

        if (command == undefined) {
            //console.log("No command specified try -h or --help for help");
            let this_generate_manifest = new generate_manifest.Generate_Manifest();
            let this_manifest = this_generate_manifest.main();
            let this_process_manifest = new manifest.Manifest(
                s3_creds = this.s3_creds,
                hf_creds = this.hf_creds,
                mysql_creds = this.mysql_creds,
                local_model_path = this.local_model_path,
                collection_path = this.collection_path
            );
            this_process_manifest.main();
        }

        if (command == 'import' && source != "hf") {
            throw new Error("Only hf is supported as a source");
        }

        if (command == "import" && source == "hf" && model == undefined) {
            let this_manifest = new manifest.Manifest(
                s3_creds = this.s3_creds,
                hf_creds = this.hf_creds,
                mysql_creds = this.mysql_creds,
                local_model_path = this.local_model_path,
                collection_path = this.collection_path
            );
            this_manifest.import_from_hf();
        }

        if (command == "import" && source == "hf" && model != undefined) {
            let this_manifest = new manifest.Manifest(
                s3_creds = this.s3_creds,
                hf_creds = this.hf_creds,
                mysql_creds = this.mysql_creds,
                local_model_path = this.local_model_path,
                collection_path = this.collection_path
            );
            this_manifest.import_from_hf(model);
        }
    }
}
