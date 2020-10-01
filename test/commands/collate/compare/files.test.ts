import { expect, test } from '@salesforce/command/lib/test';

describe('collate:compare:files', () => {
  test
    .stdout()
    .command(['collate:compare:files', '-p ../../../examples/PermissionSet1.xml', '-s ../../../examples/PermissionSet1.xml', '-m full'])
    .it('runs collate:compare:files -p ../../../examples/PermissionSet1.xml -s ../../../examples/PermissionSet1.xml -m full', ctx => {
      expect(ctx.stdout).to.contain('e');
    });
});
