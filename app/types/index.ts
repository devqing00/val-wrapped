export interface RecipientParams {
  to?: string;
}

export interface ValWrappedPageProps {
  params: Promise<{ recipient?: string }>;
  searchParams: Promise<RecipientParams>;
}
