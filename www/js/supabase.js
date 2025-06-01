// تهيئة اتصال Supabase
const supabaseUrl = 'https://ddahfspctyqouvghqfyj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkYWhmc3BjdHlxb3V2Z2hxZnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0ODI3OTcsImV4cCI6MjA2NDA1ODc5N30.OhRSpZg0_4aCRLXsK-U6jU7snqKniU9K8EtZjo__Urk';

// إنشاء عميل Supabase مع خيارات إضافية
let supabase;

if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        },
        global: {
            headers: {
                'X-Client-Info': 'supabase-js/2.0.0',
            },
        },
    });
} else if (window.createClient) {
    // بعض الإصدارات تستخدم createClient مباشرة
    supabase = window.createClient(supabaseUrl, supabaseKey);
} else {
    console.error('لم يتم العثور على مكتبة Supabase');
}

// دالة تسجيل الدخول
async function supabaseLogin(employeeId, phone, password) {
    try {
        if (!supabase) {
            throw new Error('لم يتم تهيئة Supabase بشكل صحيح');
        }
        
        console.log('محاولة تسجيل الدخول باستخدام:', { employeeId, phone });
        
        // استخدام استعلام للتحقق من المستخدم
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('phone', phone)
            .single();
            
        if (error) {
            console.error('خطأ في استعلام Supabase:', error);
            throw error;
        }
        
        console.log('بيانات المستخدم المسترجعة:', data);
        
        // التحقق من كلمة المرور (في تطبيق حقيقي، يجب استخدام تشفير)
        if (data && data.password === password) {
            return { success: true, user: data };
        } else {
            return { success: false, message: 'بيانات تسجيل الدخول غير صحيحة' };
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول: ' + error.message };
    }
}

// دالة جلب الرواتب
async function fetchSalaries(employeeId) {
    try {
        const { data, error } = await supabase
            .from('salaries')
            .select('*')
            .eq('employee_id', employeeId)
            .order('month', { ascending: false });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في جلب الرواتب:', error);
        return { success: false, message: 'حدث خطأ أثناء جلب بيانات الرواتب' };
    }
}

// دالة جلب المصروفات
async function fetchExpenses(employeeId) {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('employee_id', employeeId)
            .order('date', { ascending: false });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في جلب المصروفات:', error);
        return { success: false, message: 'حدث خطأ أثناء جلب بيانات المصروفات' };
    }
}

// دالة تغيير كلمة المرور
async function changeUserPassword(employeeId, newPassword) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ password: newPassword })
            .eq('employee_id', employeeId);
            
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('خطأ في تغيير كلمة المرور:', error);
        return { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' };
    }
}

// دالة إضافة إشعار
async function addNewNotification(title, titleEn, content, contentEn) {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .insert([
                { 
                    title, 
                    title_en: titleEn, 
                    content, 
                    content_en: contentEn,
                    created_at: new Date()
                }
            ]);
            
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('خطأ في إضافة إشعار:', error);
        return { success: false, message: 'حدث خطأ أثناء إضافة الإشعار' };
    }
}

// دالة جلب الإشعارات
async function fetchNotifications() {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في جلب الإشعارات:', error);
        return { success: false, message: 'حدث خطأ أثناء جلب الإشعارات' };
    }
}





