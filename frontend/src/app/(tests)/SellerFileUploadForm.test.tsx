import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUploadSellerFile } from "@/hooks/useSellerFilesHooks";
import SellerFileUploadForm from "@/components/seller-files/SellerFileUploadForm";

jest.mock("@/hooks/useSellerFilesHooks");

const mockedUseUploadSellerFile =
    useUploadSellerFile as jest.MockedFunction<typeof useUploadSellerFile>;

describe("SellerFileUploadForm", () => {
    it("calls upload mutation on submit", async () => {
        const user = userEvent.setup();
        const mutate = jest.fn();

        mockedUseUploadSellerFile.mockReturnValue({
            mutate,
            isPending: false,
            error: null,
        } as any);

        render(<SellerFileUploadForm />);

        // Open dialog
        const trigger = screen.getByRole("button");
        await user.click(trigger);

        const fileInput = screen.getByLabelText("Seller CSV / Excel") as HTMLInputElement;
        const file = new File(["sku,name"], "products.csv", { type: "text/csv" });

        await user.upload(fileInput, file);
        await user.click(screen.getByRole("button", { name: /upload/i }));

        expect(mutate).toHaveBeenCalled();
    });
});
