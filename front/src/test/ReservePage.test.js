import { render, screen } from '@testing-library/react';
import ReservePage from '../pages/ReservePage';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { buildings: [] } })),
}));

beforeEach(() => {
  localStorage.setItem('favorites', JSON.stringify(['Dasan Hall']));
});

test('즐겨찾기 건물이 상단에 표시되는지 확인', async () => {
  render(
    <BrowserRouter>
      <ReservePage />
    </BrowserRouter>
  );

  const title = await screen.findByText(/Favorite Classrooms/i);
  expect(title).toBeInTheDocument();
});
