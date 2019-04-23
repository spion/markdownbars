import 'jest';
import { handle } from '../src/processor';

describe('markdownbars', () => {
  it('has working filetree', () => {
    let res = handle(__dirname + '/fixture/toc.tpl.md', {});
    expect(res).toMatchSnapshot();
  });
  it('has working glob', () => {
    let res = handle(__dirname + '/fixture/glob.tpl.md', {});
    expect(res).toMatchSnapshot();
  });

  it('supports complex example', () => {
    let res = handle(__dirname + '/complex-fixture/sidebar.tpl.md', {});
    expect(res).toMatchSnapshot();
  });
});
