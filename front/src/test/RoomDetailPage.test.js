import { render, screen } from '@testing-library/react';
import RoomDetailPage from '../pages/RoomDetailPage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      availability: {
        Mon: {
          'Period 0': { status: 'unavailable', subject: 'Math' },
        },
      },
    },
  })),
}));

test('예약 불가능한 셀은 회색(unavailable)으로 표시됨', async () => {
  render(
    <BrowserRouter>
      <RoomDetailPage />
    </BrowserRouter>
  );

  const cell = await screen.findByText(/📘 Math/i);
  expect(cell).toHaveClass('unavailable');
});
