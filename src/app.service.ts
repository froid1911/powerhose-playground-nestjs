import { Injectable, Logger } from '@nestjs/common';
import {
  AddFileInput,
  DocumentDrive,
  utils as DriveUtils,
} from 'document-model-libs/document-drive';
import { Document } from 'document-model/document';

@Injectable()
export class AppService {
  store: any;
  document: DocumentDrive;
  intialState = {
    name: 'My Local Drives',
    state: {
      drives: [
        {
          id: '123',
          name: 'Local Device',
          hash: 'test',
          nodes: [
            {
              name: 'Document Models',
              path: 'Document Models',
              hash: 'folder',
              kind: 'folder',
            },
            {
              name: 'Address Book',
              path: 'Document Models/addressBook.phdm.zip',
              hash: 'Address Book',
              kind: 'file',
              documentType: 'powerhouse/document-model',
            },
            {
              name: 'Document Drive',
              path: 'Document Models/documentDrive.phdm.zip',
              hash: 'Document Drive',
              kind: 'file',
              documentType: 'powerhouse/document-model',
            },
            {
              name: 'Document Editor',
              path: 'Document Models/documentEditor.phdm.zip',
              hash: 'Document Editor',
              kind: 'file',
              documentType: 'powerhouse/document-model',
            },
          ],
        },
      ],
    },
  };

  constructor() {
    this._init();
  }

  private async saveFile(path: string, document: Document) {
    return await this.store.put(path, JSON.stringify(document));
  }

  async _init() {
    const name = 'connect-drive-test';
    const IPFS = await import('ipfs-core');
    const ORBITDB = await import('@orbitdb/core');
    const ipfs = await IPFS.create();
    const orbitdb = await ORBITDB.createOrbitDB({ ipfs });
    this.store = await orbitdb.open(name, { type: 'keyvalue' });
    this.document = new DocumentDrive(this.intialState);
    Logger.log('init');
  }

  getDrive(id: string) {
    return this.document.state.drives.find((drive) => drive.id === id);
  }

  getNode(driveId: string, path: string) {
    const drive = this.getDrive(driveId);
    return drive?.nodes.find((n) => n.path === path);
  }

  async getDocument(driveId: string, path: string): Promise<string> {
    const file = this.getNode(driveId, path);
    if (!file) {
      throw new Error(`Node with path ${path} not found on drive ${driveId}`);
    }
    if (!DriveUtils.isFileNode(file)) {
      throw new Error(
        `Node with path ${path} on drive ${driveId} is not a file`,
      );
    }

    const data = await this.store.get(path);
    return data;
  }

  async addDocument(input: AddFileInput, document: Document): Promise<boolean> {
    await this.saveFile(input.path, document);
    this.document.addFile(input);
    return true;
  }
}
