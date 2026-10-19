import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { DateTime } from '@/components/common/DateTime';
import { PageHeader } from '@/components/common/PageHeader';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { PasswordForm } from '@/components/forms/PasswordForm';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { DEFAULT_MAX_VEHICLES } from '@/constants/enums';
import { ROLES } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { changePassword, refreshMe } from '@/store/auth.slice';

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 text-end text-ink">{children}</dd>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isOwner = user.role === ROLES.OWNER;

  // The login response has no vehicleCount; /auth/me does.
  useEffect(() => {
    dispatch(refreshMe());
  }, [dispatch]);

  const handleChangePassword = async body => {
    await dispatch(changePassword(body)).unwrap();
    toast.success(t('profile.passwordChanged'));
  };

  return (
    <>
      <PageHeader title={t('profile.title')} description={t('profile.subtitle')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t('profile.account')} />
          <CardBody>
            <div className="flex items-center gap-4 border-b border-line pb-5">
              <UserAvatar user={user} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-ink">
                  {user.firstName} {user.lastName}
                </p>
                <RoleBadge role={user.role} />
              </div>
            </div>
            <dl className="divide-y divide-line">
              <Row label={t('profile.fields.username')}>
                <span dir="ltr">@{user.username}</span>
              </Row>
              <Row label={t('profile.fields.phone')}>
                <span dir="ltr">{user.phone}</span>
              </Row>
              <Row label={t('profile.fields.email')}>
                <span dir="ltr">{user.email || t('common.none')}</span>
              </Row>
              {isOwner ? (
                <>
                  <Row label={t('profile.fields.unit')}>{user.unitCode || t('common.none')}</Row>
                  <Row label={t('profile.fields.vehicles')}>
                    {t('users.vehiclesUsed', { used: user.vehicleCount ?? 0, max: user.maxVehicles ?? DEFAULT_MAX_VEHICLES })}
                  </Row>
                </>
              ) : null}
              <Row label={t('profile.fields.status')}>
                <StatusBadge kind="active" value={user.isActive} />
              </Row>
              <Row label={t('profile.fields.memberSince')}>
                <DateTime value={user.createdAt} withTime={false} />
              </Row>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t('profile.security')} description={t('profile.securityHint')} />
          <CardBody>
            <PasswordForm onSubmit={handleChangePassword} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
