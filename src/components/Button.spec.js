/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import {render, fireEvent} from '@testing-library/svelte'

import Button from "./Button.svelte";
describe("Button component", () => {
    test("should confirm there is a button in the Button component ", () => {
        const { container } = render(Button);
        expect(container).toContainHTML("<button");
        expect(container).toContainHTML("</button>");
    });

    test('show alert when the button gets clicked', async () => {
      const { getByTestId, findByRole } = render(Button, {title: 'testButton'});
      const button = getByTestId('testButton');

      // Using await when firing events is unique to the svelte testing library because
      // we have to wait for the next `tick` so that Svelte flushes all pending state changes.
      await fireEvent.click(button)

      const alertBox = findByRole('alert');

      expect(alertBox).toBeInTheDocument;
    });
});
