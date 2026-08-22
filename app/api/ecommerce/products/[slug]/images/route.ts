import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { appendStoreProductImage } from "../../../../../../lib/storeProductRepository";

export const runtime = "nodejs";

const maxUploadBytes = 4.5 * 1024 * 1024;

function isAuthorized(request: Request) {
  const expectedSecret = process.env.BLOB_UPLOAD_SECRET;
  return Boolean(
    expectedSecret &&
      request.headers.get("x-blob-upload-secret") === expectedSecret,
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Upload is not authorized." }, { status: 401 });
  }

  if (
    !process.env.BLOB_READ_WRITE_TOKEN &&
    !process.env.BLOB_UPLOAD_SECRET_STORE_ID
  ) {
    return NextResponse.json(
      {
        message:
          "Vercel Blob is not configured. Connect a Blob store or set BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const { slug } = await context.params;

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Provide an image in the file field." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files are supported." }, { status: 415 });
  }

  if (file.size > maxUploadBytes) {
    return NextResponse.json({ message: "Images must be 4.5 MB or smaller." }, { status: 413 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pathname = `products/${slug}/${crypto.randomUUID()}-${safeName}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      storeId: process.env.BLOB_UPLOAD_SECRET_STORE_ID,
    });
    const images = await appendStoreProductImage(slug, blob.url);

    if (!images) {
      await del(blob.url);
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ image: blob, images }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unable to upload product image." }, { status: 502 });
  }
}
