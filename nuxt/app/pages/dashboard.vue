<script setup lang="ts">
  import { useSession } from "~/utils/auth-client";

  const { data: session } = await useSession(useFetch);

  const router = useRouter();
</script>

<template>
  <div
    class="no-visible-scrollbar flex min-h-[80vh] items-center justify-center overflow-hidden px-6 md:px-0"
  >
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle> User </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-2">
          <div>
            <p class="text-sm">
              {{ session?.user?.name }}
            </p>
            <p class="text-xs">
              {{ session?.user?.email }}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          @click="
            async () => {
              await signOut();
              router.push('/');
            }
          "
          variant="secondary"
        >
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
