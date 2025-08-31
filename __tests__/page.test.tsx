import { render, screen } from '@testing-library/react'
import Home from '../src/app/(app)/page'
 
describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
 
    const heading = screen.getByRole('heading', {
      name: /culture kerala/i,
    })
 
    expect(heading).toBeInTheDocument()
  })
})