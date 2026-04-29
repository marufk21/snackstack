import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DashboardHeaderTitle } from "@/components/dashboard/dashboard-header-title";

// Step 1: Mock next/navigation — kyunki ye component usePathname() use karta hai
// Hum fake pathname denge, real Next.js router nahi chahiye test mein
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Ab hum isko import karte hain taaki har test mein alag pathname set kar sakein
import { usePathname } from "next/navigation";
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("DashboardHeaderTitle", () => {
  // Har test se pehle mocks reset karo — taaki ek test ka mock doosre ko affect na kare
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ Test 1: Exact match — /app route pe "My Notes" dikhna chahiye
  it('should render "My Notes" for /app route', () => {
    mockUsePathname.mockReturnValue("/app");

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  // ✅ Test 2: Exact match — /app/subscription pe "My Subscription" dikhna chahiye
  it('should render "My Subscription" for /app/subscription route', () => {
    mockUsePathname.mockReturnValue("/app/subscription");

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("My Subscription")).toBeInTheDocument();
  });

  // ✅ Test 3: Exact match — /app/pricing pe "Pricing" dikhna chahiye
  it('should render "Pricing" for /app/pricing route', () => {
    mockUsePathname.mockReturnValue("/app/pricing");

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("Pricing")).toBeInTheDocument();
  });

  // ✅ Test 4: Partial match — /app/subscription/success pe bhi "My Subscription" aana chahiye
  // Kyunki ye /app/subscription se start hota hai
  it('should render "My Subscription" for sub-routes like /app/subscription/success', () => {
    mockUsePathname.mockReturnValue("/app/subscription/success");

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("My Subscription")).toBeInTheDocument();
  });

  // ✅ Test 5: Unknown /app sub-route pe default "My Notes" aana chahiye
  it('should render "My Notes" for unknown /app sub-routes', () => {
    mockUsePathname.mockReturnValue("/app/some-random-page");

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("My Notes")).toBeInTheDocument();
  });

  // ✅ Test 6: Null pathname pe fallback "Dashboard" dikhna chahiye
  it('should render "Dashboard" when pathname is null', () => {
    mockUsePathname.mockReturnValue(null as unknown as string);

    render(<DashboardHeaderTitle />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  // ✅ Test 7: Heading h1 tag mein render hona chahiye
  it("should render as an h1 element", () => {
    mockUsePathname.mockReturnValue("/app");

    render(<DashboardHeaderTitle />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("My Notes");
  });
});
