export default (alt?: string) => {
  const router = useRouter();
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push(alt ?? "/");
  }
};
