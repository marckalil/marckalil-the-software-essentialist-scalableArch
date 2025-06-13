export class ContactListAPI {
  async addEmailToList(email: string): Promise<boolean> {
    console.log("Adding email to contact list:", email);
    return true;
  }
}
