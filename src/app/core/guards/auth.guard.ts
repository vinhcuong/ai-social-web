import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AiSocialAuthService } from '../services/ai-social-auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AiSocialAuthService);
  const router = inject(Router);

  // Support zero-click WebView auto-login via ?gcnToken=<jwt>
  const urlParams = new URLSearchParams(window.location.search);
  const injectedToken = route.queryParamMap.get('gcnToken') || urlParams.get('gcnToken');
  if (injectedToken) {
    const ok = await authService.loginWithGcnToken(injectedToken);
    if (ok) {
      return true;
    }
  }

  const validToken = await authService.ensureValidAiSocialToken();
  if (validToken) {
    if (!authService.currentUser()) {
      await authService.fetchMe();
    }
    return true;
  }

  authService.redirectUrl = state.url;
  return router.createUrlTree(['/login'], {
    queryParams: state.url && state.url !== '/' ? { redirect: state.url } : undefined,
  });
};

export const redirectIfLoggedInGuard: CanActivateFn = async () => {
  const authService = inject(AiSocialAuthService);
  const router = inject(Router);

  const validToken = await authService.ensureValidAiSocialToken();
  if (validToken) {
    return router.createUrlTree(['/channels/truyenthong']);
  }
  return true;
};
