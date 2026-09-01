import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, GripVertical, ImagePlus, LogOut, Trash2, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import "../manage.css";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export default function ManageGallery() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const utils = trpc.useUtils();
  const assetsQuery = trpc.gallery.list.useQuery(undefined, { enabled: isAuthenticated });
  const uploadMutation = trpc.gallery.upload.useMutation({
    onSuccess: async () => {
      await utils.gallery.list.invalidate();
      setFile(null);
      setPreview(null);
      setTitle("");
      setAltText("");
      toast.success("Photo added to the gallery.");
    },
    onError: (error) => toast.error(error.message),
  });
  const removeMutation = trpc.gallery.remove.useMutation({
    onSuccess: () => {
      void utils.gallery.list.invalidate();
      toast.success("Photo removed from the gallery.");
    },
    onError: (error) => toast.error(error.message),
  });
  const reorderMutation = trpc.gallery.reorder.useMutation({
    onSuccess: () => {
      void utils.gallery.list.invalidate();
      toast.success("Gallery order saved.");
    },
    onError: (error) => {
      setDragOrder(null);
      toast.error(error.message);
    },
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [dragOrder, setDragOrder] = useState<number[] | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const assets = assetsQuery.data ?? [];
  const orderedAssets = dragOrder ? dragOrder.map((id) => assets.find((asset) => asset.id === id)).filter((asset): asset is (typeof assets)[number] => Boolean(asset)) : assets;

  useEffect(() => {
    setDragOrder(null);
  }, [assetsQuery.data]);

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/")) {
      toast.error("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      toast.error("Images must be smaller than 8 MB.");
      return;
    }
    setFile(nextFile);
    setTitle(nextFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " "));
    setPreview(URL.createObjectURL(nextFile));
  };

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast.error("Choose an image first.");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    uploadMutation.mutate({
      fileName: file.name,
      title,
      altText,
      mimeType: file.type as "image/jpeg" | "image/png" | "image/webp",
      dataBase64: dataUrl.split(",")[1] ?? "",
    });
  };

  const moveAsset = (targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const currentIds = orderedAssets.map((asset) => asset.id);
    const from = currentIds.indexOf(draggedId);
    const to = currentIds.indexOf(targetId);
    if (from < 0 || to < 0) return;
    currentIds.splice(from, 1);
    currentIds.splice(to, 0, draggedId);
    setDragOrder(currentIds);
  };

  const finishReorder = () => {
    if (!dragOrder) return;
    reorderMutation.mutate({ ids: orderedAssets.map((asset) => asset.id) });
    setDraggedId(null);
  };

  if (loading) return <div className="manage-page manage-page--center">Loading studio access…</div>;
  if (!isAuthenticated) return <div className="manage-page manage-page--center"><div className="manage-gate"><span className="manage-kicker">MICHID MEDIA / PRIVATE</span><h1>Manage your<br /><em>gallery.</em></h1><p>Sign in with the owner account to add and manage portfolio images.</p><button className="manage-button" onClick={() => startLogin()}>Sign in to continue <ArrowLeft size={16} /></button><Link href="/" className="manage-back">Back to website</Link></div></div>;
  if (user?.role !== "admin") return <div className="manage-page manage-page--center"><div className="manage-gate"><span className="manage-kicker">MICHID MEDIA / PRIVATE</span><h1>Access<br /><em>restricted.</em></h1><p>This area is available to the studio owner account only.</p><button className="manage-button" onClick={() => void logout()}>Sign out <LogOut size={16} /></button><Link href="/" className="manage-back">Back to website</Link></div></div>;

  return <div className="manage-page">
    <header className="manage-header"><Link href="/" className="manage-brand">MICHID <b>MEDIA</b></Link><div className="manage-header__right"><span>{user.name ?? user.email ?? "Owner"}</span><button onClick={() => void logout()} aria-label="Sign out"><LogOut size={16} /></button></div></header>
    <main className="manage-content">
      <div className="manage-intro"><div><span className="manage-kicker">MICHID MEDIA / FILE STORAGE</span><h1>Add to the<br /><em>gallery.</em></h1></div><p>Upload an image once and it becomes a durable portfolio asset served from File Storage. Your public gallery will pick it up automatically.</p></div>
      <div className="manage-grid">
        <form className="upload-card" onSubmit={upload}>
          <label className="dropzone" htmlFor="gallery-file">{preview ? <img src={preview} alt="Selected preview" /> : <><ImagePlus size={24} /><strong>Choose a photo</strong><span>JPG, PNG, or WebP · max 8 MB</span></>}<input id="gallery-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={pickFile} /></label>
          <label className="manage-label">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Studio study / 05" /></label>
          <label className="manage-label">Alt text<input required value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe what the image shows" /></label>
          <button className="manage-button manage-button--wide" type="submit" disabled={uploadMutation.isPending}>{uploadMutation.isPending ? "Uploading…" : <><Upload size={16} /> Upload to gallery</>}</button>
          {uploadMutation.isSuccess && <p className="upload-success"><Check size={14} /> Stored securely in File Storage</p>}
        </form>
        <section className="asset-list"><div className="asset-list__head"><span>Your uploaded assets</span><span>{assets.length} files · drag to reorder</span></div>{assetsQuery.isLoading ? <p className="asset-empty">Loading assets…</p> : orderedAssets.length ? orderedAssets.map((asset) => <div className={`asset-row ${draggedId === asset.id ? "asset-row--dragging" : ""}`} key={asset.id} draggable onDragStart={() => setDraggedId(asset.id)} onDragOver={(event) => { event.preventDefault(); moveAsset(asset.id); }} onDrop={finishReorder} onDragEnd={() => setDraggedId(null)}><button className="asset-row__handle" aria-label={`Drag ${asset.title} to reorder`}><GripVertical size={16} /></button><img src={asset.fileUrl} alt={asset.altText} /><div><strong>{asset.title}</strong><span>{asset.altText}</span></div><button onClick={() => removeMutation.mutate({ id: asset.id })} aria-label={`Remove ${asset.title}`}><Trash2 size={16} /></button></div>) : <div className="asset-empty">Your uploads will appear here.<br />The existing curated images remain in the public gallery.</div>}</section>
      </div>
    </main>
  </div>;
}
