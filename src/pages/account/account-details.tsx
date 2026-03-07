import React, { useState } from 'react'
import { useUserContext } from '@/context/user-context'
import Header from '@/components/Header'
import MainContainer from '@/components/MainContainer'
import type { Breadcrumbs } from '@/types/ui'
import {
  Mail,
  Building2,
  Calendar,
  Shield,
  User,
  Lock,
  AlertCircle,
  Check,
  Layers,
  Briefcase,
  FileText,
  Download,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import useChangePassword from '@/hooks/use-change-password'
import useGetRequest from '@/hooks/use-get'
import api from '@/lib/api'

const AccountDetails: React.FC = () => {
  const { user } = useUserContext()
  const changePasswordMutation = useChangePassword()

  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const breadcrumbs: Breadcrumbs[] = [{ title: 'Account', href: '#' }]

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.password !== passwordForm.password_confirmation) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordForm.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    changePasswordMutation.mutate(passwordForm, {
      onSuccess: () => {
        setPasswordForm({
          current_password: '',
          password: '',
          password_confirmation: '',
        })
      },
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status?: number) => {
    if (status === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded">
          <div className="w-1 h-1 rounded-full bg-emerald-600" />
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-slate-600 bg-slate-100 rounded">
        <div className="w-1 h-1 rounded-full bg-slate-400" />
        Inactive
      </span>
    )
  }

  const getVerificationBadge = (verified?: string) => {
    if (verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 rounded">
          <Check className="w-3 h-3" />
          Verified
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-amber-700 bg-amber-50 rounded">
        <AlertCircle className="w-3 h-3" />
        Unverified
      </span>
    )
  }

  if (!user) {
    return (
      <>
        <Header breadcrumbs={breadcrumbs} />
        <MainContainer>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-600">Unable to load account</p>
            </div>
          </div>
        </MainContainer>
      </>
    )
  }

  const [isDownloadingReport, setIsDownloadingReport] = useState(false)

  const handleDownloadMonthlyReport = async () => {
    setIsDownloadingReport(true)
    try {
      const response = await api.get('/api/download/monthly-report', {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `monthly_report_${new Date().toISOString().slice(0, 7)}.pdf`,
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Failed to download report:' + error.message)
      }
    } finally {
      setIsDownloadingReport(false)
    }
  }

  return (
    <>
      <Header breadcrumbs={breadcrumbs} />

      <MainContainer>
        <div>
          {/* Profile Header */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              <div className="shrink-0">
                <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl sm:text-2xl font-semibold text-white">
                    {user.first_name.charAt(0)}
                    {user.last_name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                  <span className="text-sm text-slate-600 capitalize">
                    {user.role}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-slate-600">{user.office}</span>
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {getStatusBadge(user.status)}
                  {getVerificationBadge(user.email_verified_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Personal Information
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                {/* Full Name */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Full Name
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium text-right ml-4 break-words min-w-0">
                    {user.first_name} {user.last_name}
                  </span>
                </div>

                {/* Email */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Email Address
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium break-all text-right max-w-[50%] ml-4">
                    {user.email || '—'}
                  </span>
                </div>

                {/* Office */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Office
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium text-right ml-4 break-words min-w-0 max-w-[55%]">
                    {user.office || '—'}
                  </span>
                </div>

                {/* Department */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Layers className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Department
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium text-right ml-4 break-words min-w-0 max-w-[55%]">
                    {user.department || '—'}
                  </span>
                </div>

                {/* Designation */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Designation
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium text-right ml-4 break-words min-w-0 max-w-[55%]">
                    {user.designation || '—'}
                  </span>
                </div>

                {/* Account Role */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Account Role
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium capitalize text-right ml-4">
                    {user.role}
                  </span>
                </div>

                {/* Member Since */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      Member Since
                    </span>
                  </div>
                  <span className="text-sm text-slate-900 font-medium text-right ml-4">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </section>

            {/* Security */}
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Security
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg">
                {!isChangingPassword ? (
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Password
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last updated {formatDate(user.updated_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.current_password}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              current_password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={changePasswordMutation.isPending}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.password}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={changePasswordMutation.isPending}
                        />
                        <p className="text-xs text-slate-500 mt-1.5">
                          Must be at least 8 characters
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.password_confirmation}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              password_confirmation: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          required
                          disabled={changePasswordMutation.isPending}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {changePasswordMutation.isPending
                          ? 'Updating...'
                          : 'Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordForm({
                            current_password: '',
                            password: '',
                            password_confirmation: '',
                          })
                        }}
                        disabled={changePasswordMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Monthly Reports */}
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Monthly Reports
              </h2>
              <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
                {/* Current Month */}
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date().toLocaleString('default', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Current month report
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadMonthlyReport()}
                    disabled={isDownloadingReport}
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloadingReport ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Info note */}
                <div className="px-6 py-3 bg-slate-50 rounded-b-lg">
                  <p className="text-xs text-slate-400">
                    Report includes all documents handled in the current month.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </MainContainer>
    </>
  )
}

export default AccountDetails
