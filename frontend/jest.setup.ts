import "@testing-library/jest-dom";

jest.mock("next/font/google", () => ({
    Inter: () => ({ className: "inter-mock" }),
    DM_Sans: () => ({ className: "dm-sans-mock" }),
}));

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => "",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// Mock Pointer Capture methods for Radix UI
if (typeof Element !== 'undefined') {
    Element.prototype.hasPointerCapture = () => false;
    Element.prototype.setPointerCapture = () => { };
    Element.prototype.releasePointerCapture = () => { };
    Element.prototype.scrollIntoView = jest.fn();
}
