import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import { store } from '@/routes/login';
import { Form, Head } from '@inertiajs/react';
import { Lock, Mail } from 'lucide-react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    return (
        <AuthSimpleLayout
            title="Masuk sebagai admin"
            description="Masikan Email dan Password dibawah ini"
        >
            <Head title="Log in" />

            <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative">
                {/* Header */}
                <div className="relative bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-2 rounded-lg shadow-md">
                                    <Lock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-white">Login Admin</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative max-w-md mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-white">Selamat Datang</h2>
                                <p className="text-green-100 mt-1">Silakan login untuk melanjutkan</p>
                            </div>
                        </div>

                        {/* Form Body */}
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="p-6 space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Email Input */}
                                    <div>
                                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Input */}
                                    <div>
                                        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-green-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    <span>Logging in...</span>
                                                </span>
                                            ) : (
                                                <span className='text-white'>Login</span>
                                            )}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="fixed top-4 right-4 z-50">
                        <div className="bg-green-500/90 text-white border border-green-400 rounded-lg shadow-lg backdrop-blur-lg p-4">
                            <p className="text-sm font-medium">{status}</p>
                        </div>
                    </div>
                )}
            </div>
        </AuthSimpleLayout>
    );
}
